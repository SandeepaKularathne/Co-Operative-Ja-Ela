package lk.cooperative.cooperativejaela.entity;

import lk.cooperative.cooperativejaela.util.RegexPattern;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.sql.Date;
import java.util.Arrays;

@Entity
public class Vehicle {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "number")
    @Pattern(regexp = "^([A-Z\\s]{1,3}|\\d{1,3})\\d{4}$", message = "Invalid Number")
    private String number;
    @Basic
    @Column(name = "doattach")
    @RegexPattern(reg = "^\\d{2}-\\d{2}-\\d{2}$", msg = "Invalid Date Format")
    private Date doattach;
    @Basic
    @Column(name = "yom")
    @RegexPattern(reg = "^\\d{4}$", msg = "Invalid Year")
    private Integer yom;
    @Basic
    @Column(name = "capacity")
    @RegexPattern(reg = "^\\d{4}$", msg = "Invalid Capacity")
    private int capacity;
    @Basic
    @Column(name = "description")
    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;
    @Basic
    @Column(name = "poto")
    private byte[] poto;
    @Basic
    @Column(name = "curentmeterreading")
    @RegexPattern(reg = "^\\d{6}$", msg = "Invalid Meter Reading")
    private int curentmeterreading;
    @Basic
    @Column(name = "lastregdate")
    @RegexPattern(reg = "^\\d{2}-\\d{2}-\\d{2}$", msg = "Invalid Date Format")
    private Date lastregdate;
    @Basic
    @Column(name = "lastservicedate")
    @RegexPattern(reg = "^\\d{2}-\\d{2}-\\d{2}$", msg = "Invalid Date Format")
    private Date lastservicedate;
    @ManyToOne
    @JoinColumn(name = "vehiclestatus_id", referencedColumnName = "id", nullable = false)
    private Vehiclestatus vehiclestatus;
    @ManyToOne
    @JoinColumn(name = "vehicletype_id", referencedColumnName = "id", nullable = false)
    private Vehicletype vehicletype;
    @ManyToOne
    @JoinColumn(name = "vehiclemodel_id", referencedColumnName = "id", nullable = false)
    private Vehiclemodel vehiclemodel;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public Date getDoattach() {
        return doattach;
    }

    public void setDoattach(Date doattach) {
        this.doattach = doattach;
    }

    public Integer getYom() {
        return yom;
    }

    public void setYom(Integer yom) {
        this.yom = yom;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getPoto() {
        return poto;
    }

    public void setPoto(byte[] poto) {
        this.poto = poto;
    }

    public int getCurentmeterreading() {
        return curentmeterreading;
    }

    public void setCurentmeterreading(int curentmeterreading) {
        this.curentmeterreading = curentmeterreading;
    }

    public Date getLastregdate() {
        return lastregdate;
    }

    public void setLastregdate(Date lastregdate) {
        this.lastregdate = lastregdate;
    }

    public Date getLastservicedate() {
        return lastservicedate;
    }

    public void setLastservicedate(Date lastservicedate) {
        this.lastservicedate = lastservicedate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Vehicle vehicle = (Vehicle) o;

        if (id != vehicle.id) return false;
        if (capacity != vehicle.capacity) return false;
        if (curentmeterreading != vehicle.curentmeterreading) return false;
        if (number != null ? !number.equals(vehicle.number) : vehicle.number != null) return false;
        if (doattach != null ? !doattach.equals(vehicle.doattach) : vehicle.doattach != null) return false;
        if (yom != null ? !yom.equals(vehicle.yom) : vehicle.yom != null) return false;
        if (description != null ? !description.equals(vehicle.description) : vehicle.description != null) return false;
        if (!Arrays.equals(poto, vehicle.poto)) return false;
        if (lastregdate != null ? !lastregdate.equals(vehicle.lastregdate) : vehicle.lastregdate != null) return false;
        if (lastservicedate != null ? !lastservicedate.equals(vehicle.lastservicedate) : vehicle.lastservicedate != null)
            return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (number != null ? number.hashCode() : 0);
        result = 31 * result + (doattach != null ? doattach.hashCode() : 0);
        result = 31 * result + (yom != null ? yom.hashCode() : 0);
        result = 31 * result + capacity;
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + Arrays.hashCode(poto);
        result = 31 * result + curentmeterreading;
        result = 31 * result + (lastregdate != null ? lastregdate.hashCode() : 0);
        result = 31 * result + (lastservicedate != null ? lastservicedate.hashCode() : 0);
        return result;
    }

    public Vehiclestatus getVehiclestatus() {
        return vehiclestatus;
    }

    public void setVehiclestatus(Vehiclestatus vehiclestatus) {
        this.vehiclestatus = vehiclestatus;
    }

    public Vehicletype getVehicletype() {
        return vehicletype;
    }

    public void setVehicletype(Vehicletype vehicletype) {
        this.vehicletype = vehicletype;
    }

    public Vehiclemodel getVehiclemodel() {
        return vehiclemodel;
    }

    public void setVehiclemodel(Vehiclemodel vehiclemodel) {
        this.vehiclemodel = vehiclemodel;
    }
}
