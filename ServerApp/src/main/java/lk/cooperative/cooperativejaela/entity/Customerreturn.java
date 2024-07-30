package lk.cooperative.cooperativejaela.entity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Customerreturn {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "date")
    private String date;
    @Basic
    @Column(name = "grandtotal")
    private BigDecimal grandtotal;
    @OneToMany(mappedBy = "customerreturn")
    private Collection<Critem> critems;
    @ManyToOne
    @JoinColumn(name = "invoice_id", referencedColumnName = "id", nullable = false)
    private Invoice invoice;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public BigDecimal getGrandtotal() {
        return grandtotal;
    }

    public void setGrandtotal(BigDecimal grandtotal) {
        this.grandtotal = grandtotal;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Customerreturn that = (Customerreturn) o;
        return id == that.id && Objects.equals(date, that.date) && Objects.equals(grandtotal, that.grandtotal);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, date, grandtotal);
    }

    public Collection<Critem> getCritems() {
        return critems;
    }

    public void setCritems(Collection<Critem> critems) {
        this.critems = critems;
    }

    public Invoice getInvoice() {
        return invoice;
    }

    public void setInvoice(Invoice invoice) {
        this.invoice = invoice;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
}
